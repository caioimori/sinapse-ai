# React Bits corpus fallback map

Official sources:

- Repository: https://github.com/DavidHDev/react-bits
- Registry: https://reactbits.dev/r/registry.json
- Documentation: https://reactbits.dev/get-started/index
- Installation: https://reactbits.dev/get-started/installation
- MCP: https://reactbits.dev/get-started/mcp
- LLM index: https://reactbits.dev/llms.txt

Pinned SINAPSE snapshot: `3acbd54115330a42e39f63dda2d4859e998b6684`,
14/07/2026. It contains 139 components and 556 named registry variants. The three
non-JS-CSS variants of CurvedInput are published but empty in this snapshot.

Install format:

```bash
npx shadcn@latest add @react-bits/<Component>-TS-TW
npx shadcn@latest add https://reactbits.dev/r/<Component>-TS-TW
npx jsrepo@latest add https://reactbits.dev/r/<Component>-TS-TW
```

Configure the alias in `components.json` with
`"@react-bits": "https://reactbits.dev/r/{name}.json"`.

Use MIT + Commons Clause terms: application/site/product use is permitted, including
commercial use, but the components themselves cannot be sold, sublicensed or
redistributed alone, bundled, or as a port.
