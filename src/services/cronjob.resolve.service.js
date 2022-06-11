const handleInput = (input) => {
    console.log(`Schedule to parse ${input}`);
    return "0 9 * * * *";
}

module.exports = {
    handleInput
}