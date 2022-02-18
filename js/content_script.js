document.body.addEventListener('click', (e) => {
	init(e.target);
}, true);

const DESCRIPTION_BTN_ID = 'nm_preview_markdown_description_btn';
const DESCRIPTION_PREVIEW_ID = 'nm_preview_markdown_description';
const DESCRIPTION_TEXT_AREA_SELECTOR = '.editable .description-content .description-edit .description';
const COMMENT_TEXT_AREA_CLASSES = 'comment-box-input js-new-comment-input';
const COMMENT_BTN_ID = 'nm_preview_markdown_comment_btn';
const COMMENT_PREVIEW_ID = 'nm_preview_markdown_comment';

function init(target)
{
	setTimeout(() => {
		// add preview for description
		if (target.closest('.description-content.js-desc-content')) {
			if (document.querySelector('.editable').classList.contains('editing')) {
				if (!document.getElementById(DESCRIPTION_BTN_ID)) {
					let button = document.createElement('BUTTON');
					button.setAttribute('type', 'button');
					button.classList.add('helper', 'nch-button');
					button.id = DESCRIPTION_BTN_ID;
					button.style.right = '125px';
					button.innerHTML = 'Preview';
					document.querySelector('.description-edit').prepend(button);
					button.addEventListener('click', toggleDescriptionPreview);
				}
			} else {
				document.getElementById(DESCRIPTION_BTN_ID).remove();
				document.querySelector(DESCRIPTION_TEXT_AREA_SELECTOR).style.display = 'block';
				if (document.getElementById(DESCRIPTION_PREVIEW_ID)) {
					document.getElementById(DESCRIPTION_PREVIEW_ID).remove();
				}
			}
		}

		// add preview for comment
		if (target.tagName == 'TEXTAREA' && target.classList.value.includes(COMMENT_TEXT_AREA_CLASSES)) {
			addPreviewCommentBtn(target);
		} else if (target.tagName == 'INPUT' && target.classList.contains('js-add-comment')) {
			resetCommentPreview(target.closest('.comment-box'), document.getElementById(COMMENT_BTN_ID));
		}
	}, 500);
}

function toggleDescriptionPreview(event)
{
	let $btn = event.target;
	if ($btn.classList.contains('open')) {
		$btn.innerHTML = 'Preview';
		$btn.classList.remove('open');
		document.getElementById(DESCRIPTION_PREVIEW_ID).remove();
		document.querySelector(DESCRIPTION_TEXT_AREA_SELECTOR).style.display = 'block';
		document.querySelector(DESCRIPTION_TEXT_AREA_SELECTOR).focus();

		return;
	}

	document.querySelector(DESCRIPTION_TEXT_AREA_SELECTOR).style.display = 'none';
	$btn.classList.add('open');
	$btn.innerHTML = 'Close preview';
	let descriptionPreview = document.createElement('DIV');
	descriptionPreview.id = DESCRIPTION_PREVIEW_ID;
	descriptionPreview.innerHTML = convertToHtml(document.querySelector(DESCRIPTION_TEXT_AREA_SELECTOR).value);
	document.querySelector('.description-edit').prepend(descriptionPreview);
}

function addPreviewCommentBtn(target)
{
	let $parent = target.closest('.comment-box').querySelector('.comment-box-options');
	if ($parent.querySelector('#' + COMMENT_BTN_ID)) {
		return;
	}

	let button = document.createElement('A');
	button.setAttribute('href', '#');
	button.id = COMMENT_BTN_ID;
	button.classList.add('comment-box-options-item');
	let span = document.createElement('SPAN');
	span.classList.add('icon-sm');
	span.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#42526e" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0h24v24H0z" stroke="none"/><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15V9l2 2 2-2v6M14 13l2 2 2-2m-2 2V9"/></svg>';
	button.append(span);
	button.addEventListener('click', toggleCommentPreview);
	$parent.append(button);
}

function toggleCommentPreview(event)
{
	let $btn = event.target;
	let $parent = $btn.closest('.comment-box');

	if (document.getElementById(COMMENT_BTN_ID).classList.contains('opened')) {
		resetCommentPreview($parent, $btn);
		return;
	}

	$btn.closest('a').style.backgroundColor = '#091e4214';
	$btn.closest('a').classList.add('opened');
	$parent.querySelector('textarea').style.display = 'none';
	let commentPreview = document.createElement('DIV');
	commentPreview.id = COMMENT_PREVIEW_ID;
	commentPreview.innerHTML = convertToHtml($parent.querySelector('textarea').value);
	$parent.prepend(commentPreview);
}

function resetCommentPreview($parent, $btn)
{
	$btn.closest('a').style.backgroundColor = 'transparent';
	$btn.closest('a').classList.remove('opened');
	$parent.querySelector('textarea').style.display = 'block';
	document.getElementById(COMMENT_PREVIEW_ID).remove();
}

function convertToHtml(markdownText)
{
	let converter = new showdown.Converter();

	return converter.makeHtml(markdownText);
}