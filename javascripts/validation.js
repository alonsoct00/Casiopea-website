$(function(){
        $('#send').click(function(e){
            //Stop form submission & check the validation
            e.preventDefault();
            
            // Variable declaration
            var error = false;
            var name = $('#name').val();
            var email = $('#email').val();
            var phone = $('#phone').val();
            var message = $('#message').val();
            
            if(email.length == 0 || email.indexOf('@') == '-1'){
                var error = true;
                $('#email').addClass('error');
            }else{
                $('#email').removeClass('error');
            }
            if(name == ''){
                var error = true;
                $('#name').addClass('error');
            }else{
                $('#name').removeClass('error');
            }
            if(message == ''){
                var error = true;
                $('#message').addClass('error');
            }else{
                $('#message').removeClass('error');
            }
            
            // Small helper: prefer the live translation if i18n.js has loaded one,
            // otherwise fall back to the text already on the page (Spanish default).
            function t(key, fallback) {
                return (window.CasiopeaI18n && window.CasiopeaI18n.t(key, fallback)) || fallback;
            }

            // If there is no validation error, next to process the mail function
            if(error == false){
               // Disable submit button just after the form processed 1st time successfully.
                $('.msg').fadeOut();
                $('#send').attr({'disabled' : 'true'});
                $('#send').text(t('contact.form.sending', 'Enviando'));
                /* Post Ajax function of jQuery to get all the data from the submission of the form as soon as the form sends the values to email.php*/
                $.post("php/email.php", $("#form").serialize(),function(result){
                    if(result == 'sent'){
                        //If the email is sent successfully, remove the submit button
                        $('#send').attr({'disabled' : 'true'});
                        $('#send').text(t('contact.form.thanks', '¡Gracias!'));
                    } else {
                        $('#send').removeAttr('disabled');
                        $('#send').text(t('contact.form.error', '¡Error!'));
                    }
                });
            } else {
                $('.msg').text(t('contact.form.validationError', 'Por favor corrige los campos marcados.'));
                $('.msg').fadeIn();
            }
        });    
    });
