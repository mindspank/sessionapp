var userstring = users.map(d => {
	return '<div class="user"><p>' + d + '</p></div>'
}).join('\n');

$('#container').append(userstring)