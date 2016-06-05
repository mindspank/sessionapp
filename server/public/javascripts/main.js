var userstring = users.map(d => {
	return '<div class="user" id="' + d.id + '"><p>' + d.name + '</p></div>'
}).join('\n');


$('#container').append(userstring)
$('#container').on('click', '.user', ev => {
	window.location.href = '/user/' + ev.currentTarget.id
})