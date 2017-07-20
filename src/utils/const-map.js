export default function constMap(consts) {
    return consts.reduce((map, c) => ({ ...map, [c]: c, [c.toLowerCase()]: c}), {})
}