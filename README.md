# 2022 Individual Programming Project - AI Flashcards
## Description
An educational website for young kids 4-10 years old studying basic vocabulary. Simply draw a picture of the word on the front on the flashcard, and ROBOT will let you know if you drew the right picture!

### Contributor(s)
* Tate Larkin                                   


<p align="center">
    <h1>Project Design</h1>
</p>

### Machine learning model
&emsp;I decided to use Google's ResNet-34 Neural Network architecture for this project. This architecture utilizes Residual Learning, where you add a skip connection between different layers in the net. A block of two convolution layers with another single convolution layer which connects to the output of the two layers is called a Residual Unit. This architecture uses deep layers of Residual Units with doubling feature maps and halfing dimensions. This lets the model learn very complex patterns with less complexity and memory overhead.
<br>
<br>
In addition, I used early stopping to reduce overfitting, and Nadam optimization.

<p align="center">
    <b>Logic Flowchart</b>
</p>

![flowchart](https://github.com/tate8/2022IndividualProject/blob/main/images/AIFlashcards.drawio.png)

<p align="center">
    <b>Website Landing Page</b>
    <br>
    <img src="https://github.com/tate8/2022IndividualProject/blob/main/images/AIFlashcardsLandingPage.png" width="800" height="600"></img>
    <br>
    <br>
    <b>Website Flashcard Page</b>
    <br>
    <img src="https://github.com/tate8/2022IndividualProject/blob/main/images/AIFlashcardsCardPage.png" width="800" height="600"></img>
</p>

<p>
    <h1>Project Implementation</h1>
</p>
