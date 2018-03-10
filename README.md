<h2>How to compile and run</h2>

- Open a terminal window, navigate to a directory where you would like to place the project, and type “git clone https://github.com/sfsu-csc-667-fall-2017/term-project-teamg-monopoly.git” [enter]

- Create a file in the root directory called “.env” and type the following (replacing password with your postgres password):
“DATABASE_URL=postgres:://postgres:passwordhere@localhost:5432/monopoly”

- Type “sudo -u postgres psql postgres” [enter]
- Type “CREATE DATABASE monopoly;” [enter]

- Type “\q” to exit the psql prompt
- Type “npm install” [enter] to grab all the npm dependencies that our project requires
- Type “npm run start:dev” to begin running the server
- Open your favorite web browser(preferably Chrome) and navigate to “localhost:5000” to play our game!
