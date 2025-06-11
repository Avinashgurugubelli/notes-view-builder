# Sample Project to Render Notes as a Web Page

## Notes

- Place your notes directories inside the `src` folder.
- Use folder and file names that start with a number (e.g., `1.Introduction`, `1_Introduction`) to ensure sorted order.
- After adding your notes, run:

    ```bash
    python file-list-generator.py
    ```

    This will generate a JSON file with directory and file information.

- Copy the generated JSON and save it in the `data` folder as `data.js`, assigning it to a constant named `data`, for example:

    ```javascript
    const data = {};
    ```

- Install `http-server` (or any static server) and use it to serve `index.html`.

    - Example: Install `http-server` using Node and npm, then run:

        ```bash
        http-server
        ```

      from your project directory to start the static server.
