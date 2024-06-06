export function elipsisText(text: string, length: number): string {
    if (text.length > length) {
        return text.slice(0, length) + "...";
    }
    return text;
}

const MAX_FILENAME_LENGTH = 26;

export function nicefyFileName(fileName: string): string {
    if (fileName.length <= MAX_FILENAME_LENGTH) {
        return fileName;
    }

    const fileNameParts = fileName.split(".");

    if (fileNameParts.length > 1) {
        if (fileNameParts[fileNameParts.length - 1].length > 10) {
            return elipsisText(fileName, MAX_FILENAME_LENGTH);
        }
        const extension = fileNameParts[fileNameParts.length - 2]
                .slice(fileNameParts[fileNameParts.length - 2].length - 1) + "." +
            fileNameParts[fileNameParts.length - 1];
        return elipsisText(fileNameParts.reverse().slice(1).reverse().join("."), MAX_FILENAME_LENGTH - extension.length) + extension;
    }

    return elipsisText(fileName, MAX_FILENAME_LENGTH);
}