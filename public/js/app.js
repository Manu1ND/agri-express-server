let params = (new URL(document.location)).searchParams;
let callbackurl = params.get("callbackurl");

function loginSubmit(event) {
  event.preventDefault();

  var formElements = document.querySelector('#loginForm').elements;
  var userType = formElements.userType.value;
  var phoneNo = formElements.phoneNo.value;
  const data = {
      "phoneNo": phoneNo,
      "callbackurl": callbackurl
    }

  fetch('/api/' + userType + '/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      window.close();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

document.querySelector('#loginForm').addEventListener('submit', loginSubmit);