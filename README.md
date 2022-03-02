# GoFinances

Gofinances is an app used to control personal finances that uses google credentials to authenticate. 
All the data is saved on the device using AsyncStorage.

<p align="center">
<img 
  src="./assets/app-demo.gif" alt="Demonstration from application"
  width="300"
  height="650"
>
</p>

### Built With

* React Native;
* Expo;
* Typescript;
* Styled Components;
* Bottom tabs and Stack Navigation;

### Prerequisites

Expo is needed to install the app.
Google credentials are needed to login on the app. You can learn more about expo google authentication on the [documentation](https://docs.expo.dev/guides/authentication/#google).

### Installing / Getting started

* Clone the repository: ```git clone https://github.com/everton-araujo/go-finances.git```;

* Rename the **.env-example** file on root directory to **.env** and put your google credentials;

* On the project folder, download the dependecies running: ```yarn``` or ```npm install``` on the terminal;

* On the terminal run the application: ```expo start```;

* With the Android emulator running, go to the Metro Bundler terminal and press "A". Or go to web page that has open and press the "Run on Android devide/emulator" button.

### TODO

* [] Record the app functionalities and make a gif with it; 
* [] Create tests;
* [] Add another authentication method;
* [] Export the data to excel;
* [] Safe the data on a database;

[⬆ Voltar ao topo](#GoFinances)<br>
