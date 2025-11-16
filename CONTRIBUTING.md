# Contributing to Amir Salahshur Portfolio

First off, thank you for considering contributing to this project! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any examples of similar features in other projects**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies:** `npm install`
3. **Make your changes** following the code style guidelines
4. **Test your changes:** `npm run dev`
5. **Build to ensure no errors:** `npm run build`
6. **Commit your changes** using descriptive commit messages
7. **Push to your fork** and submit a pull request

#### Pull Request Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Update documentation as needed
- Add tests if applicable
- Ensure all tests pass
- Keep pull requests focused on a single concern

## Development Setup

### Prerequisites

- Node.js (v18.0 or higher)
- npm (v9.0 or higher)

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/amirsalahshur.git
cd amirsalahshur

# Add upstream remote
git remote add upstream https://github.com/amirsalahshur/amirsalahshur.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Project Structure

```
├── app/           # Next.js app directory
├── components/    # React components
├── data/          # Content data
├── lib/           # Utilities and configuration
├── types/         # TypeScript types
└── public/        # Static files
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper types for all props and functions
- Avoid using `any` type
- Use interfaces for object shapes

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and variable names
- Add JSDoc comments for complex components

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Maintain responsive design principles
- Ensure accessibility standards are met

### Commits

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add dark mode toggle
fix: resolve navigation mobile menu issue
docs: update README with deployment instructions
style: format code with Prettier
```

## Testing

Before submitting a pull request:

1. Test your changes locally
2. Build the project: `npm run build`
3. Run linter: `npm run lint`
4. Test in multiple browsers
5. Test responsive design on different screen sizes

## Questions?

Feel free to open an issue with your question or reach out via:

- Email: amirsalahshur2@gmail.com
- Twitter: @salahshur_amir
- GitHub Discussions

Thank you for contributing! 🙌
