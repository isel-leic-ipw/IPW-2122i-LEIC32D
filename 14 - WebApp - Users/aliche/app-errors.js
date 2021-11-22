'use strict';

function buildErrorList() {
	const errors = {};

	function addError(code, name, message) {
		errors[name] = info => {
			return { code, name, message, info };
		};
	}
	
	addError(1000, 'FAIL', 'An error occurred');
	addError(1001, 'NOT_FOUND', 'The item does not exist');
	addError(1002, 'EXT_SVC_FAIL', 'External service failure');
	addError(1003, 'MISSING_PARAM', 'Required parameter missing');
	addError(1004, 'INVALID_PARAM', 'Invalid value for parameter');
	
	return errors;
}

const errorList = buildErrorList();

module.exports = errorList;
