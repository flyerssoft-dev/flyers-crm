const emptyStringValidation = (value) => {
        if (!!!value)
            return "This field is required"
        if (!value.replace(/\s/g, '').length)
            return "You Entered Only Spaces"                                                                            
    }

export const RequiredRegex = {
    validate: emptyStringValidation,
}; 

export const AlphabetOnlyRegex = {
    validate: emptyStringValidation,
    pattern : {
        value : /^[a-zA-Z ]*$/,
        message : "Enter Proper Name"
    }
};

export const AlphaNumericRegex = {
    validate: emptyStringValidation,
    pattern : {
        value : /^[a-zA-Z0-9 ]*$/,
        message : "Enter Proper Name"
    }
};

export const EmailRegex = {
    validate: emptyStringValidation,
    pattern : {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message : "Enter Valid Email"
    }
};

export const DescriptionRegex = {
    validate: emptyStringValidation,
};

export const PasswordRegex = {
    validate: emptyStringValidation,
};

export const NumberRegex = {
    validate: (value) => {
        if (!!!value)
            return "This field is required"
        if(parseInt(value) < 1)
            return "Value Should be Greater than 0"
        if(parseInt(value) > 1000000)
            return "Maximum Value is 10,00,000" 
        if(value.indexOf('.') !== -1)
            return "Decimals Not Allowed"            
    }
};

export const NumberWithZeroAllowedRegex = {
    validate: (value) => {
        if (!!!value)
            return "This field is required"
        if(parseInt(value) < 0)
            return "Invalid Value"
        if(parseInt(value) > 1000000)
            return "Maximum Value is 10,00,000" 
        if(value.indexOf('.') !== -1)
            return "Decimals Not Allowed"            
    }
};

export const NumberRegexNonRequired = {
    validate: (value) => {
        if(parseInt(value) < 0)
            return "Invalid Value"
        if(parseInt(value) > 1000000)
            return "Maximum Value is 10,00,000" 
        if(value.indexOf('.') !== -1)
            return "Decimals Not Allowed"            
    }
};


export const DiscountRegex = {
    validate: (value) => {
        if (!!!value)
            return "This field is required"
        if(parseInt(value) > 99 || parseInt(value) < 1)
            return "Invalid Percentage"
        // if(value.indexOf('.') !== -1)
        //     return "Decimals Not Allowed" 
    },
    pattern : {
        value : /^[0-9]*(\.[0-9]{0,1})?$/,
        message : "Max 1 Decimal Allowed"
    }
};

export const ZeroDiscountRegex = {
    validate: (value) => {
        if (!!!value)
            return "This field is required"
        if(parseInt(value) > 99 || parseInt(value) < 0)
            return "Invalid Percentage"
        // if(value.indexOf('.') !== -1)
        //     return "Decimals Not Allowed" 
    },
    pattern : {
        value : /^[0-9]*(\.[0-9]{0,1})?$/,
        message : "Max 1 Decimal Allowed"
    }
};

export const URIRegex = {
    validate: (value) => {
        if (!!!value)
            return "This field is required"
    },
    pattern: {
        value: /^(http:\/\/|https:\/\/)?([a-z0-9][a-z0-9]*\.)+[a-z0-9][a-z0-9]*$/i,
        message: "Enter Valid URL"
    }
};


export const TransactionIDRegex = {
    validate: emptyStringValidation,
    minLength: {
        value: 5,
        message: "Minimum 5 Chars"
    },
    pattern: {
        value: /^[a-zA-Z0-9 ]*$/,
        message: "Enter Valid Reference ID"
    }
}

