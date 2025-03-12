# Folder

An open source project to help you organize your files and folders and share them with others or make publish as website.

## Prerequisites

1. Cloudflare Account
2. Github Account (to get the Github token)
3. A domain (optional)

## Deploy

1. Create a Database (D1) and Bucket (R2) in your Cloudflare Account
2. Create OAuth Apps in your Github Account developer Settings and get the client id and secret
3. Clone the repository `git clone https://github.com/bansal/folder.git`
4. Change directory `cd folder`
5. Run `npm install`
6. Rename wrapper.example.toml to wrapper.toml and update the configuration
7. Run `npm run deploy`

## Disclaimer

This project is still in development. **Use at your own risk.** See [DISCLAIMER](DISCLAIMER.md) for details.

## License

Read [LICENSE](LICENSE)
