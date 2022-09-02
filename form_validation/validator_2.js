function Validator(formSelector) {
    var _this = this;
    var formRules = {};

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    /**
     * Quy ước tạo rule
     * - Nếu có lỗi --> message lỗi
     * - Không có lỗi --> undefined
     */

    var validatorRules = {
        required: function (value) {
            return value ? undefined : "Vui lòng nhập trường này";
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Trường này phải là email";
        },
        min: function (minLength) {
            return function (value) {
                return value.length >= minLength
                    ? undefined
                    : `Vui lòng nhập ít nhất ${minLength} kí tự`;
            };
        },
        max: function (maxLength) {
            return function (value) {
                return value.length <= maxLength
                    ? undefined
                    : `Vui lòng nhập tối đa ${maxLength} kí tự`;
            };
        },
    };

    // Lấy ra form element trong DOM theo formSelector
    var formElement = document.querySelector(formSelector);

    // Chỉ xử lý khi có element trong DOM
    if (formElement) {
        var inputs = formElement.querySelectorAll("[name][rules]");
        for (var input of inputs) {
            var rules = input.getAttribute("rules").split("|");
            for (var rule of rules) {
                var ruleInfo;
                var isRuleHasValue = rule.includes(":");

                if (isRuleHasValue) {
                    ruleInfo = rule.split(":");
                    rule = ruleInfo[0];
                }

                var ruleFunc = validatorRules[rule];
                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }

            // Lắng nghe sự kiện để validate (blur, change,...)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }

        // Hàm thực hiện validate
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage = undefined;
            for (var rule of rules) {
                if (rule(event.target.value)) {
                    errorMessage = rule(event.target.value);
                    break;
                }
            }
            if (errorMessage) {
                // Nếu có lỗi thì hiển thị message lỗi ra UI
                var formGroup = getParent(event.target, ".form-group");
                if (formGroup) {
                    formGroup.classList.add("invalid");
                    var formMessage = formGroup.querySelector(".form-message");
                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            } else {
                var formGroup = getParent(event.target, ".form-group");
                if (formGroup) {
                    formGroup.classList.remove("invalid");
                    var formMessage = formGroup.querySelector(".form-message");
                    if (formMessage) {
                        formMessage.innerText = "";
                    }
                }
            }

            return !errorMessage;
        }

        // Hàm clear message lỗi
        function handleClearError(event) {
            var formGroup = getParent(event.target, ".form-group");
            if (formGroup && formGroup.classList.contains("invalid")) {
                formGroup.classList.remove("invalid");
                var formMessage = formGroup.querySelector(".form-message");
                if (formMessage) {
                    formMessage.innerText = "";
                }
            }
        }
    }

    // Xử lý hành vi submit form
    formElement.onsubmit = function (e) {
        e.preventDefault();

        var inputs = formElement.querySelectorAll("[name][rules]");
        var isValid = true;

        for (var input of inputs) {
            if (
                !handleValidate({
                    target: input,
                })
            ) {
                isValid = false;
            }
        }

        // Khi không có lỗi thì submit form
        if (isValid) {
            if (typeof _this.onSubmit === "function") {
                var enableInputs = formElement.querySelectorAll("[name]");
                var formValues = Array.from(enableInputs).reduce(function (values, input) {
                    switch (input.type) {
                        case "checkbox":
                            if (!input.matches("checked")) {
                                return;
                            }
                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }

                            values[input.name].push(input.value);
                            break;
                        case "radio":
                            if (input.matches(":checked")) {
                                values[input.name] = input.value;
                            } else if (!values[input.name]) {
                                values[input.name] = "";
                            }
                            break;
                        case "file":
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    }
                    return values;
                }, {});

                // Gọi lại hàm obSubmit và trả về giá trị của form
                _this.onSubmit(formValues);
            } else {
                formElement.submit();
            }
        } else {
            console.log("Có lỗi");
        }
    };
}
