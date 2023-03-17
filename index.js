const DUMP_FROM = 0;
const DUMP_TO = 100;

task("sd", "storage dump (All slots it can find)") 
    .addParam("address", "contract\'s address")
    .addParam("to", "Max storage slot to check", DUMP_TO, types.int)
    .addFlag("raw", "log each checked slot", false, types.boolean)
    .setAction(async (taskArgs) => {    // remember to use correct address
        aggregatorAddr = taskArgs.address;
        raw = taskArgs.trace;

        console.log(`dumping all values from ${DUMP_FROM} to ${taskArgs.to}`);
        
        for(i = DUMP_FROM; i <= taskArgs.to; i++) {
            hexValue = '0x' + i.toString(16);
            const someValue =  await network.provider.send('eth_getStorageAt', 
            [aggregatorAddr, hexValue]);

            [value_type, value] = try_decode(someValue, raw);
            switch (value_type) {
                case 'none': 
                    break;
                default:
                    console.log(`[${i}] ${value_type}: ${value}`);
                    break;
            }
        }
    });


function try_decode(some256Value, raw) {
    if (raw) {
        return ['!   RAW', some256Value];
    }
    if (some256Value.slice(2) == 0) { return ['none', 0] } 
    // First 24 elements are 0 
    if (some256Value.slice(2, 26) == 0) {
        // Possibly address
        if (some256Value.slice(26, 30) != 0) {
            return ['address', ethers.utils.getAddress('0x' + some256Value.slice(26))];
        }
        possible_uint = ethers.BigNumber.from(some256Value);
        return ['uint256', possible_uint.toString()];
    }

    let start_index = 0;
    let end_index = 0;
    console.log(some256Value);
    // Find possible gap with zeroes 
    [start_index, end_index] = ai_analyze_zeroes(some256Value);
    let start_encoded_element = some256Value.slice(2, start_index);
    let end_encoded_element = some256Value.slice(end_index);
    try {
        maybe_num = ethers.BigNumber.from("0x" + end_encoded_element);
    } catch (error) {
        // Fuck it, just return unknown, deal with it
        return ['unknown', some256Value];
    }

    if (ethers.BigNumber.from(start_encoded_element.length).eq(maybe_num)) {
        maybe_str = try_decode_string(start_encoded_element);
        return ['string ', maybe_str];
    }
    return ['unknown', some256Value];
}

// It just telling me to write in typescript
// Like in each freaking answer 
// It just hates small simple projects apparently 
function ai_analyze_zeroes(some256Value) {
    let start_index = 0;
    let end_index = 0;
    let is_sequence = false;

    for (let i = 2; i < some256Value.length; i++) {
        if (!is_sequence && some256Value.slice(i, i + 2) === "00") {
            start_index = i;
            is_sequence = true;
        }

        if (is_sequence && some256Value[i] !== "0") {
            end_index = i;
            break;
        }
    }

    // If the loop ends with an ongoing sequence of zeroes, update the end_index
    if (is_sequence && end_index === 0) {
        end_index = some256Value.length;
    }

    return [start_index, end_index];
}
function analyze_zeroes(some256Value) {
    start_index = 0;
    end_index = 0;
    is_sequence = false;
    for (let i = 2; i < some256Value.length; i++) {
        if (!is_sequence && some256Value.slice(i, i + 2) == 0){
            start_index = i;
            is_sequence = true;
        }

        if (is_sequence && some256Value[i] != "0") {
            end_index = i;
            is_sequence = false;
            return [start_index, end_index];
        } 
    }
}

function try_decode_string(bytes_sequence) {
    str = '';
    for (let i = 0; i < bytes_sequence.length; i += 2) {
        str += String.fromCharCode(parseInt(bytes_sequence.slice(i, i+2), 16));
    }
    return str;
}
