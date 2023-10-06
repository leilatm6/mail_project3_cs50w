document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  const recipients = document.querySelector('#compose-recipients');
  const subject = document.querySelector('#compose-subject');
  const body = document.querySelector('#compose-body');

  // Clear out composition fields
  recipients.value = '';
  subject.value = '';
  body.value = '';

  
  const composeForm = document.querySelector('#compose-form');
  composeForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!recipients.value.includes('@')){
      recipients.value ='';
      recipients.placeholder = "Please Enter Valid Recipients";
      console.log('error')
      return false;
    }
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients.value,
          subject: subject.value,
          body: body.value
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        //console.log(result);
        load_mailbox('inbox');

    });
  })


}




function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
 .then(response=>response.json())
 .then(emails => {
   if (emails['error'] != null ){
    console.log(emails.error)
   }
   else{
    const List = document.createElement('ul');
    List.setAttribute('class', "list-group");
    List.id= "mailboxlist";
    document.querySelector('#emails-view').appendChild(List);
    for(let email of emails){
      const listItem = document.createElement('li');
      listItem.classList.add("list-group-item","mailbox-item", email.read ? "read":"unread"); 
      listItem.dataset.emailid = email.id   
      listItem.innerHTML = `<div class="mailbox-sender">${email.sender}</div>
      <div class="mailbox-subject">${email.subject}</div>
      <div class=" mailbox-timestamp"><small> ${email.timestamp}</small></div>`
      List.appendChild(listItem);
    }
    const mailBoxList =document.querySelector("#mailboxlist")
    mailBoxList.addEventListener('click',(event)=>{
      const clickedLi = event.target.closest('li');
      if (clickedLi){
        console.log('Clicked on:', clickedLi.textContent);
        load_email(clickedLi.dataset.emailid);
      } 
 });
   }
 });
 
// document.querySelector("#mailboxlist").addEventListener('mousemove',(event)=>{
//});
}

function load_email(emailid){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

fetch(`/emails/${emailid}`)
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email);
    const emailData = {
      subject: email.subject,
      sender: email.sender,
      body: email.body,
      time: email.timestamp
  };
    emailshow(emailData);
    fetch(`/emails/${emailid}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    })

});
}




function emailshow(emailData){

emailView = document.querySelector('#email-view');
emailView.innerHTML = "";
// Create email container
const emailContainer = document.createElement('div');
emailContainer.classList.add('email-container');

// Create email subject element
const emailSubject = document.createElement('div');
emailSubject.classList.add('email-subject');
emailSubject.textContent = emailData.subject;

// Create email sender element
const emailSender = document.createElement('div');
emailSender.classList.add('email-sender');
emailSender.textContent = emailData.sender;

// Create email body element
const emailBody = document.createElement('div');
emailBody.classList.add('email-body');
emailBody.textContent = emailData.body;

// Create email time element
const emailTime = document.createElement('div');
emailTime.classList.add('email-time');
emailTime.textContent = emailData.time;

// Append elements to the email container
emailContainer.appendChild(emailSubject);
emailContainer.appendChild(emailSender);
emailContainer.appendChild(emailBody);
emailContainer.appendChild(emailTime);

// Add the email container to the document
emailView.appendChild(emailContainer);
}