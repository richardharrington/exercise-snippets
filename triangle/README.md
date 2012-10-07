# The Triangle Exercise

Recently I had to hire someone to help me out at work, and I was running the interviews, which I'd never done before. 

My two co-workers (Ruby guys) told me that when one of them had interviewing for the job, he was sent an exercise to complete. My other co-worker, who had tried the problem also, had come up with a long, convoluted solution. So when the new guy emailed back with something that was about ten lines long, they hired him.

Here's the problem: You have a triangle of numbers, like

         1
        4 3
       1 9 7 
      1 1 5 9

and the question is, what is the greatest of all the sums that you can get by tracing a path of adjacent numbers from the top of the triangle and adding one number per row as you go down the rows?

For instance, in this case the answer is 20: the sum of the numbers 1, 3, 7, and 9, tracing a path down the right edge.

A text file is provided with this exercise that has 100 rows, too many to do without automating it. The answer for this text file is 732506.

Before looking at either of my co-workers' solutions, I tried it myself and thought I had come up with a pretty elegant solution using recursion and memoization to calculate all of the possible answers and store the partial ones as it goes along so it doesn't take forever. That can be found in recursive.js.

Then I looked at my co-worker's solution, which (in slightly modified form) is in __bottom\_to\_top\_clobbering.rb__. (If you're not familiar with ruby, you can look at the version I created in JavaScript, __bottom\_to\_top\_clobbering.js__.) It basically turns the triangle upside down and goes through it from the wide top to the single-element bottom, _replacing_ each number in the triangle with the partial results based on the ones above it.

This one was a lot shorter than mine, and mostly more elegant. This was a lesson to me: recursion may seem cool, but it's not always the best idea.

However, taking it up where my co-worker left off, I think I was able to make it even more elegant by using the reduceRight array method, thus making it more pure, functional-programming-wise. This method goes from the bottom of the triangle and works its way up, storing a row with the partial results as it goes along, but it doesn't touch the original array. This can be found in __bottom\_to\_top\_reducing.js__. I made a ruby version also, but ruby doesn't have reduceRight, only reduce, so I had to reverse the array first. However, ruby's reverse method (unless you specify other otherwise) doesn't mutate the original array as JavaScript's does, so it's a little better.

And, last but not least, I made coffeescript versions of all of these, in addition to one final coffeescript file which is called __bottom\_to\_top\_reducing\_with\_comprehensions.coffee__. It's definitely the shortest of the bunch, but it's kind of hard to read. I'm still not totally sold on coffeescript.