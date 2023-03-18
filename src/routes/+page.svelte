<style>
    html,
    body{
        border: 0;
        padding: 0;
        margin: 0;
        font-family:Arial, Helvetica, sans-serif
    }
    h1 {
        font-family: 'Courier New', Courier, monospace
    }
    main {
        max-width: 1800px;
        margin: 0 auto;
        border: 1px dashed red;
    }
    textarea {
        width: 100%;
        height: 10em;
        display:block;
        padding: 0;
        box-sizing: border-box;

    }
    .wip {
        pointer-events: none;
        opacity: 0.8;
        background: linear-gradient(45deg, #000 0, #000 24%, #ba0 25%,#ba0 75%, #000 76%, #000 100%) 0 0/80px 20px repeat;
    }
    pre {
        white-space: normal;
    }
</style>
<script lang="ts">
    import {
        extractWithTokens
    } from '../lib/extractor';
    let input = [];
    let output: any[] = [];

    let probability: {token: string; p:number}[] = [];
    let totalInfo = 0;
    $: {
        let sum = 0;
        for( const {p} of probability) {
            sum += - Math.log2(p);
        }
        totalInfo = sum;
    }

    function process (e) {
        const str = e.target.value;
        const frequency = new Map;
        const input: string[] = str.split(/\s+/);
        input.forEach(token => {
            frequency.set(token, (frequency.get(token) || 0) + 1);
        });
        const arr = []
        for (const [token, count] of frequency) {
            arr.push({token, p: count / input.length});
        }
        probability = arr;
        output = extractWithTokens(input);
    }

</script>
<h1>Welcome to Randomness Extractor</h1>
<main>
    <div>
        <textarea placeholder="insert text here" on:change={process}></textarea>
    </div>
    <div>
        <p>Input tokens: {input.length}</p>
        <p>Input bits: {totalInfo}</p>
        <details>
            <table>
                {#each probability as {token, p}}
                    <tr><td>{token}</td><td>{p}</td></tr>
                {/each}
            </table>
        </details>
        <p>Output bits: {output.length}</p>
        <div>Output: <pre>{output.join('​')}</pre></div>
        <p>Avg: {output.reduce((sum, v) => sum+=v, 0)/output.length}</p>
    </div>
</main>
