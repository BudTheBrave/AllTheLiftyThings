<template>
    <div class="body-wrapper">
        <div>
            <h2>Welcome to my Lifts Dictonary</h2>
            <p>
                This was made as a reference to lots of lifts 
                along with a way to hopefully syncronize names
                along the way.
            </p>
            <p>
                Furthermore I do relalise there are many names 
                to the same move so I will be using mainly the 
                ones that I use.
            </p>
        </div>


        <footer>
            <h3>Want to add?</h3>
            <p>Making your own is currently unavailable, </p>
            <p>however feel free to send an email to</p>
            <a href="mailto: alltheliftythings@gmail.com">alltheliftythings@gmail.com</a> 
            <p>and please include the name, <br> style (ballroom, swing, acrobatics), <br> and photos/videos</p>
        </footer>
    </div>
</template>



<script setup>


</script>

<style lang="scss" scoped>
.body-wrapper{
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 61px);
    justify-content: space-between;
}

h2{
    padding: 10px 0 0 0;
    margin: 10px;
}

footer {
    margin-block: 10px;
    p, h3, a {
        margin: 1px;
    }

    a {
        color: var(--primary-dark-teal);
        text-decoration: none;
    }
    
}


</style>