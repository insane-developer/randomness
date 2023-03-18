
type Frame = number[];

function tryExtractBits([left, right]: Frame, bits: any[]): {sum: number; borders: Frame} {

    let lower = 0;
    let upper = 1;
    let sum = 0;
    while (lower <= left && upper >= right) {
        const midpoint = (lower + upper) / 2;
        if (left >= midpoint) {
            sum++;
            bits.push(1);
            lower = midpoint;
        } else if (right <= midpoint) {
            sum++;
            bits.push(0);
            upper = midpoint;
        } else {
            const frame = [lower, upper];
            return {
                sum,
                borders: [rescaleOut(frame, left), rescaleOut(frame, right)]
            };
        }
    }
    return {
        sum,
        borders: [left, right]
    };
}

function rescaleIn(frame: Frame, value: number) {
    return frame[0] + value * (frame[1] - frame[0]);
}
function rescaleOut(frame: Frame, value: number) {
    return (value - frame[0]) / (frame[1] - frame[0]);
}

export function extractWithTokens(input: string[]) {
    /** 1. read token
     *    - if token is unknown
     *        - add token with probability = 1/sumprevtokens
     *    - else
     *        - adjust token probability = tokenlength / sumprevtokens
     *  2. place mark on the scale
     *  3. find additional data with binary search
     *  4. rescale borders
     */
    let sumPrevTokens = 0;
    let knownTokens = new Map<string, {value: number; index: number}>();
    let currentPlace = [0, 1];
    let bitsLeft = 0;
    let outputBits: number[] = [];
    for (const token of input) {
        let item = knownTokens.get(token) || {
            value: 0,
            index: knownTokens.size
        };

        knownTokens.set(token, item);

        if (item.value === 0) {
            item.value++;
            sumPrevTokens++;
            continue;
        }
        const p = item.value / sumPrevTokens;
        const entropy = - Math.log2(p);
        bitsLeft += entropy;

        let prevSum = 0;
        for (let val of knownTokens.values()) {
            if (val.index < item.index) {
                prevSum += val.value;
            } else {
                break;
            }
        }
        const cut = [prevSum / sumPrevTokens, (prevSum + item.value) / sumPrevTokens];
        const [a, b] = cut;
        console.log(`token "${token}": p = ${p}\tentropy=${entropy}\tbits left=${bitsLeft}, cut:\n`, cut);
        currentPlace = [rescaleIn(currentPlace, a), rescaleIn(currentPlace, b)];
        //console.log(currentPlace);

        const {sum, borders} = tryExtractBits(currentPlace, outputBits);
        //if (sumPrevTokens % 1000 === 0){
            console.log(`${sumPrevTokens}: Had ${bitsLeft} bits, consumed ${sum} bits, `, borders);
        //}
        currentPlace = borders;
        bitsLeft -= sum;

        item.value++;
        sumPrevTokens++;
    }


    return outputBits;
}
