export const required = (value) => {
    if (value) {
        return undefined;
    } else {
        return "Field is requierd";
    }
}

export const maxLengthCreator = (maxLength) => (value) => {
    if (value && value.length > maxLength) {
        return `Max ${maxLength} simvolov`;
    } else {
        return undefined;
    }
}