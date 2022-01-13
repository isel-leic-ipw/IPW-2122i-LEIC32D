'use strict';

function setupForList() {
	const deleteButtons = document.querySelectorAll('.cls-del-but'); 
	deleteButtons.forEach(delBut => {
		delBut.onclick = onDeleteBook;
	});
	return;
	
	async function onDeleteBook() {
		const bookId = this.id.substr(8);
		
		try {
			await apiDeleteBook(bookId);
			deleteTableEntry(bookId);
		} catch (err) {
			alert(err);
		}
	}

	async function apiDeleteBook(bookId) {
		const delReqRes = await fetch(
			'/api/my/books/' + bookId,
			{ method: 'DELETE' }
		);
		if (delReqRes.status === 200) {
			return;
		}
		throw Error(
			'Failed to delete book with id ' + bookId + '\n' +
			delReqRes.status + ' ' + delReqRes.statusText 
		);
	}

	function deleteTableEntry(bookId) {
		const tableEntryId = '#entry-' + bookId;
		const tableEntry = document.querySelector(tableEntryId);
		tableEntry.parentNode.removeChild(tableEntry);
	}
}
