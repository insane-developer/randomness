<style>
    :global(html),
    :global(body) {
        border: 0;
        padding: 0;
        margin: 0;
        font-family:Arial, Helvetica, sans-serif
    }
    h1 {
        font-family: 'Courier New', Courier, monospace
    }
    main {
        max-width: 1000px;
        padding: 0 1em;
        margin: 0 auto;
    }
    textarea {
        width: 100%;
        height: 10em;
        display:block;
        padding: 0;
        box-sizing: border-box;

    }
    pre {
        white-space: normal;
    }
</style>
<script lang="ts">
    import {
        extractWithTokens
    } from '../lib/extractor';
    let inputLength = 0;
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
        inputLength = input.length;
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
<main>
    <h1>Welcome to Randomness Extractor</h1>
    <div>
        <textarea placeholder="insert text here" on:change={process}></textarea>
    </div>
    <div>
        <p>Input tokens: {inputLength}</p>
        <p>Input bits: {totalInfo}</p>
        {#if output.length}
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
        {/if}
    </div>
</main>
