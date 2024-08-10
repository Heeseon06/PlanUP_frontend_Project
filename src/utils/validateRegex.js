/**
 * id 형식확인
 * 4자 이상, 영문자, 숫자만 허용
 * @param {*} id 
 * @returns {boolean}
 * @example
 * validateId('test1234') // true
 * validateId('test') // false
 * validateId('test!@#') // false
 */
export const validateId = (id) => {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(id) && id.length >= 4;
};


/**
 * password 형식확인
 * 8자 이상, 대문자, 소문자, 숫자, 특수문자 포함
 * @param {*} password
 * @returns {boolean}
 * @example
 * validatePassword('Test1234!') // true
 * validatePassword('test1234') // false
 * validatePassword('test') // false
 * validatePassword('test!@#') // false
 */
export const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

/**
 * email 형식확인
 * @param {*} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * 핸드폰 번호 형식 확인
 * @param {*} hp
 * @returns {boolean}
 * @example
 * validateHP('010-1234-5678') // true
 * validateHP('010-1234-567') // false
 * validateHP('010-1234-56789') // false
 */
export const validateHP = (hp) => {
    // 국가 번호인 010으로 시작하고, 나머지 번호를 포함하는 정규식
    const regex = /^010-\d{4}-\d{4}$/;
    return regex.test(hp);
};

/**
 * 주민등록번호 형식 확인 유효성 검사
 * @param {*} ssn1
 * @param {*} ssn2
 * @returns {boolean}
*/
export const validateSSN = (ssn1, ssn2) => {
    const validateSSN1 = (ssn1) => {
        // 주민등록번호 앞자리 검증: 6자리 숫자
        const regex = /^\d{6}$/;
        return regex.test(ssn1);
    };

    const validateSSN2 = (ssn2) => {
        // 주민등록번호 뒷자리 검증: 7자리 숫자
        const regex = /^\d{7}$/;
        return regex.test(ssn2);
    };

    const isValidSSN = (ssn1, ssn2) => {
        // 주민등록번호 유효성 검사
        if (!validateSSN1(ssn1) || !validateSSN2(ssn2)) {
            return false;
        }
        const ssn = ssn1 + ssn2;
        const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(ssn.charAt(i)) * weights[i];
        }
        const remainder = sum % 11;
        const checkDigit = (11 - remainder) % 10;
        return parseInt(ssn.charAt(12)) === checkDigit;
    };

    return isValidSSN(ssn1, ssn2);
};

/**
 * 이름 형식 확인
 * 2자 이상 20자 이하 한글만 허용
 * @param {*} name
 * @returns {boolean}
 */
export const validateName = (name) => {
    const regex = /^[가-힣]{2,20}$/;
    return regex.test(name);
};