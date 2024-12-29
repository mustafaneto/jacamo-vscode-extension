# JaCaMo VSCode Extension

This extension streamlines the process of setting up and managing JaCaMo projects directly within Visual Studio Code.

## Features

- **Create JaCaMo Project**: Easily create a new JaCaMo project by downloading the necessary files and setting up template agents and applications.
- **Run JaCaMo Project**: Quickly run your JaCaMo project using the integrated terminal.

## Installation

1. Clone the repository or download the ZIP file.
2. Open the project folder in Visual Studio Code.
3. Install the required dependencies by running:
   ```
   npm install
   ```
4. Open the command palette (Ctrl+Shift+P) and type `Reload Window` to activate the extension.

## Usage

- To create a new JaCaMo project, open the command palette (Ctrl+Shift+P) and select `JaCaMo: Create Project`. Choose a folder where you want to set up the project.
- To run your JaCaMo project, open the command palette and select `JaCaMo: Run Project`.

## Template Files

The extension automatically creates the following template files in the specified project folder:

- **alice.asl**: Defines the agent "alice" with a rule to say hello.
- **bob.asl**: Defines the agent "bob" with a rule to handle greetings from "alice".
- **my1st_app.jcm**: Defines a JaCaMo application that includes both agents.

## Contributing

Feel free to submit issues or pull requests to improve the extension. 

## License

This project is licensed under the MIT License.