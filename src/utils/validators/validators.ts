export type FieldValidatorType = (value: string) => string | undefined;

export const required: FieldValidatorType = (value) => {
    if (value) {
        return undefined;
    } else {
        return "Field is requierd";
    }
}

export const maxLengthCreator = (maxLength: number): FieldValidatorType => (value) => {
    if (value && value.length > maxLength) {
        return `Max ${maxLength} characters`;
    } else {
        return undefined;
    }
}