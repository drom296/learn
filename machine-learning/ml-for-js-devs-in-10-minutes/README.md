following: https://medium.com/javascript-in-plain-english/ml-for-js-devs-in-10-minutes-46794782762e


# Building JS-based Hate Speech Classification Model

This section contains a simple implementation of hate speech classification model on top of JavaScript using the following technologies:

- NodeJS
- Natural JS
- csvtojson

### Purpose

The classification model showcased in this section is used for determining if a certain text fed to it contains:

- Hate Speech
- Offensive Language
- Neither

### Why did you not embed any validation (K-Fold or 75 / 25 % train test split) code?

Splitting and folding of dataset was not added in this repository to simplify it. The article was targeted at attracting JS developers to start building ML-powered APIs and to quickly on-board them to different ways of deploying machine learning models to Lambda-based APIs.

### Dataset Credits

This repository is utilizing a dataset that t-davidson built on this github [repository](https://github.com/t-davidson/hate-speech-and-offensive-language).

### Natural JS - Naive Bayes Results

The Naive Bayes classifier produced the following results:

```txt
Accurate: 17,706 out of 24,783 items
Missed: 7,077 out of 24,783 items
Accuracy: 71.44
Error Rate: 28.56
```

71.55% accuracy is not that bad! If you are automating curation of chatbot messages, this classification model can remove 71.55% of work from your staff.
