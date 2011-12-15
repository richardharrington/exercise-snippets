# Implement Queue Using Stack

A couple months ago, I was having lunch with some friends of mine, on the West Coast. They were living in a cabin in the middle of nowhere with just enough electricity to run a laptop and a lightbulb. One of them had spent the morning interviewing candidates on Skype for positions at the startup he worked for remotely, and when I asked him what kind of questions he was asking, he said, well, for instance, how do you implement a queue using only stacks? 

I thought about it for a few minutes and realized how I would do it, although I wasn't able to think of a very elegant solution until much later.  But the key is to not overthink it. Once the terminology was explained, everyone around the table who was not a programmer was able to figure this one out pretty quickly too. Basically, anybody who has ever had to get a book from the bottom of a stack of books, where the stack was too heavy to lift all at once, knows the answer to this question.

The solution in this folder writes new versions of shift and unshift for the Array prototype in Javascript, as if they didn't already exist. 