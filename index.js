const DUMP_FROM = 0;
const DUMP_TO = 100;

task("contract-dump-memory", "Print all contract's memory slots") 
    .addParam("address", "contract\'s address")
    .setAction(async (taskArgs) => {    // remember to use correct address
        aggregatorAddr = taskArgs.address;

        console.log(`dumping all values from ${DUMP_FROM} to ${DUMP_TO}`);
        
        for(i = DUMP_FROM; i <= DUMP_TO; i++) {
            hexValue = '0x' + i.toString(16);
            const someValue =  await network.provider.send('eth_getStorageAt', 
            [aggregatorAddr, hexValue]);

            [value_type, value] = try_decode(someValue);
            switch (value_type) {
                case 'none': 
                    break;
                default:
                    console.log(`[${i}] ${value_type}: ${value}`);
                    break;
            }
        }
    });


function try_decode(some256Value) {
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
    // Find possible gap with zeroes 
    [start_index, end_index] = analyze_zeroes(some256Value);
    let start_encoded_element = some256Value.slice(2, start_index);
    let end_encoded_element = some256Value.slice(end_index);
    // TODO try-catch
    maybe_num = ethers.BigNumber.from("0x" + end_encoded_element).toNumber();
    if (start_encoded_element.length == maybe_num) {
        maybe_str = try_decode_string(start_encoded_element);
        return ['string', maybe_str];
    }
    return ['unknown', some256Value];
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
