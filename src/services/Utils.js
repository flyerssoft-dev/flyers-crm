import moment from 'moment';
// import lodash from 'lodash'

const base64Converter = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			let result = reader.result;
			result = result.replace('data:image/jpeg;base64,', '');
			result = result.replace('data:image/jpg;base64,', '');
			result = result.replace('data:image/png;base64,', '');
			result = result.replace('data:application/pdf;base64,', '');
			resolve(result);
		};
		reader.onerror = (error) => reject(error);
	});

const getCurrentDate = (format) => {
	return moment(new Date()).format(format || 'DD-MM-YYYY');
};

const getTodaysDate = () => {
	return moment().date();
};

const getCurrentYear = () => {
	return moment().year();
};

const getDateAfterYears = (years, format) => {
	return moment(new Date())
		.add(years, 'years')
		.format(format || 'DD-MM-YYYY');
};

const getDateBeforeYears = (years, format) => {
	return moment(new Date())
		.subtract(years, 'years')
		.format(format || 'DD-MM-YYYY');
};

// const isIdentical = (json1,json2) => lodash.isEqual(json1,json2);

const getDateFormat = (data, format = 'DD/MM/YYYY h:mm A') => (!!data ? moment(data || '').format(format) : 'N/A');

export function inWords(amount = 0) {
	const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function convertTwoDigit(num) {
    if (num < 20) {
      return ones[num];
    } else {
      return tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
    }
  }

  function convertThreeDigit(num) {
    let hundred = Math.floor(num / 100);
    let remainder = num % 100;

    let result = '';
    if (hundred > 0) {
      result += ones[hundred] + ' hundred ';
    }
    if (remainder > 0) {
      result += convertTwoDigit(remainder);
    }
    return result.trim();
  }

  if (amount === 0) {
    return 'zero rupees only';
  }

  let words = '';
  let crore = Math.floor(amount / 10000000);
  let lakh = Math.floor((amount % 10000000) / 100000);
  let thousand = Math.floor((amount % 100000) / 1000);
  let remaining = amount % 1000;

  if (crore > 0) {
    words += convertThreeDigit(crore) + ' crore ';
  }
  if (lakh > 0) {
    words += convertThreeDigit(lakh) + ' lakh ';
  }
  if (thousand > 0) {
    words += convertThreeDigit(thousand) + ' thousand ';
  }
  if (remaining > 0) {
    words += convertThreeDigit(remaining);
  }

  words += ' rupees only';
  return words.trim();
}

export {
	base64Converter,
	getCurrentDate,
	getCurrentYear,
	getTodaysDate,
	getDateAfterYears,
	getDateBeforeYears,
	// isIdentical,
	getDateFormat,
};
