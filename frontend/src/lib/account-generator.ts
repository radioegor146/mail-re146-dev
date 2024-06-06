export function generateRandomAccount(): string {
    const charset = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    const length = Math.floor(Math.random() * 4 + 5);
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    result += Math.floor(Math.random() * 1000);
    return result;
}