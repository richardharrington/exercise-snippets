# Combine Letters

This function came about after a friend of mine told me that he had recently had an interview during which he was asked to write a function that takes as its argument an array of characters (in Javascript, strings of length 1) and returns an array of all the strings that can be formed from combinations of those characters, with no duplicates.

He wasn't able to do it, but he got the job anyway, and now he's very happy there, and the guy who asked him the question in the interview has been suitably impressed with his skills.

I went home and wrote this out, but it took me a lot longer than the amount of time I would have been given in an interview!

I couldn't figure out whether he meant for all strings of all lengths to be returned, or just strings of the same length as the array. In other words, when given

    ['a','t']
    
is it supposed to return

    ['at', 'ta']
    
or

    ['a', 't', 'at', 'ta']
    
?

I decided to write both. The files in this folder labeled "1" are the former option, and the files labeled "2" contain the latter. Version 1 is a little more elegant-looking. Version 2 is actually an elaboration of version 1 -- it takes an optional argument which if true tells it to return words of all sizes. This argument defaults to false, so version 2 has exactly the same effect as version 1 if you don't pass that optional argument.


## Description

The heart of the code is the function 'recur' which carefully builds up words letter by letter and then cumulatively loads found words into an array contained in a closure, so it's not a pure recursive function but rather one that relies upon its side effects to build up a final value.

So it's a little different and more complicated (for me) than classic uses of recursion such as looking through nodes of a tree. Like all recursive functions, though, it sifts through data to finer and finer levels until it gets to the finest, at which point it does its thing and exits without recurring again, thus backing up a level. This is the <if> statement. The <else> statement is where the sifting through the data and the recursive call happens.

It wouldn't take too much effort to convert version 2 into a very simple way to cheat at Boggle, or Scrabble, and I discovered a blog post by John Resig about this exact topic (well, not cheating, but searching large dictionaries). Ajax calls to dictionary websites to check each of the words individually would be too time-consuming, but there are a few places easily available on the Internet where the Scrabble dictionary is posted as a text file, so you can just download that to the client once (it's about 1 MB), and then you're good to go.

