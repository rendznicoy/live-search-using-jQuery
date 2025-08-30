<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="./assets/image/search.png" type="image/x-icon" />
        <title>Live Search JSON Data using jQuery & Ajax</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
        <link rel="stylesheet" href="style.css">
        <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css">
    </head>
    <body>
        <br /><br />
        <div class="container">
            <h2>JSON Live Data Search using Ajax jQuery</h2>
            <h3>Employee Data</h3>
            <br /><br />
            <div align="center">
                <input type="text" name="search" id="search" placeholder="Search Employee..." class="form-control" />
            </div>
            <ul class="list-group" id="result">
            </ul>
            <br />
        </div>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
        <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
        <script>
            AOS.init({ offset: 0 });
        </script>
        <script src="script.js"></script>
    </body>
</html>

<script>
    $(document).ready(function() {
        $('#search').keyup(function(){
            $('#result').html('');
            var searchField = $('#search').val();
            var expression = new RegExp(searchField, "i");
            $.getJSON('data.json', function(data){
                $.each(data, function(key, value){
                    if(value.name.search(expression) != -1 || value.location.search(expression) != -1)
                    {
                        $('#result').append('<li class="list-group-item"><img src="" '+value.image+' height="40" width="40" class="img-thumbnail" /> '+value.name+' | <span class="text-muted">'+value.location+'</span></li>');
                    }
                });
            })
        });
    });
</script>