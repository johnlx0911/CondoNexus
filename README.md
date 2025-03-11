# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

How to start the app?
1. Open terminal, cd to the project path, in this case, "cd projects/CondoNexusExpo"
2. After within the correct path, just type "npm start"
3. Then terminal will handle, to use in development mode, leave it default, to use Expo using actual phone, press 's' to switch to Expo Go mode
4. Use actual phone' cam scan the QR, will direct to Expo App, and open your project

MySQL
1. Root Password : BACS3143CondoNexus
2. User Credentials:
    - John, John@2003
    - Varsya, Varsya@1234
3. To use MySQL, first login using root password, then type: "use condonexus" (to choose use which db, in this case, is condonexus)
4. To check the current registered list, type: "SELECT * FROM users;"
5. To delete specific registered account, type: "DELETE FROM users WHERE email = 'user@example.com';"
6. To reset the unique number to 1, type: "ALTER TABLE users AUTO_INCREMENT = 1;"

To link the project with database
1. Open terminal, cd to backend, type: "node server.js"
2. Then a result will show server running on port ****, then mention also connected to MySQL Database

Change Authentication Method (Sometimes will face error during connection server because the authentication method not match)
1. Open Admin CMD, navigate to where your MySQL downloaded, in this case, navigate to: "C:\Program Files\MySQL\MySQL Server 8.0\bin"
2. Then type and run: "mysql -u root -p"
3. We will need to run our databse within the cmd this case, type: "USE mysql;" to use the databse
4. Alter the user authentication method using this code: 
   - "ALTER USER 'John'@'%' IDENTIFIED WITH mysql_native_password BY 'your_password';"
   - FLUSH PRIVILEGES;
5. And also:
   - "ALTER USER 'Varsya'@'%' IDENTIFIED WITH mysql_native_password BY 'your_password';"
   - FLUSH PRIVILEGES;
6. Reopen MySQL, check the authentication method using this line: "SELECT user, host, plugin FROM mysql.user;"
7. If correct, Users should be mentioned as mysql_native_password, all done

Push and Retrieve Database from different Node
1. Open up admin cmd, navigate to the path: "C:\Program Files\MySQL\MySQL Server 8.0\bin"
2. Then type: "mysqldump -u John -p condonexus > backup.sql"
3. backup.sql file will be created maybe in C: or C:\Users
4. Send that file to other node, download it
5. Same command: "C:\Program Files\MySQL\MySQL Server 8.0\bin"
6. But this time, use < instead of >, and also 'mysql' instead of 'mysqldump': "mysql -u John -p condonexus < backup.sql"

MySQL
1. To delete specific account from users using specific unique id, type: "DELETE FROM users WHERE id = 1;"
2. To reset the unique id start from 1, type: "ALTER TABLE users AUTO_INCREMENT = 1;"