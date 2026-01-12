export const createQuizValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: "Quiz name must not be empty"
        }
    },
    topic: {
        notEmpty: {
            errorMessage: "Quiz name must not be empty"
        }
    },
    rating: {
        isFloat: {
            in: ['body'],
            options: {
                min: 0,
                max: 5
            },
            errorMessage: "Rating must be an decimal with values between 0.0 to 5.0"
        }
    },
    attempts: {
        isInt: {
            options : {
                min : 0
            },
            errorMessage : "No. of attempts must be an integer"
        }
    },
    avgScore: {
        isFloat: {
            options : {
                min : 0
            },
            errorMessage : "Average Score must be an decimal value"
        }
    },
    highestScore: {
        isFloat: {
            options : {
                min : 0
            },
            errorMessage : "Highest Score must be an decimal value"
        }
    },
    totalReviews: {
        isInt: {
            options : {
                min : 0
            },
            errorMessage : "Total Reviews must be an integer"
        }
    }
}