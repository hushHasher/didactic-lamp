# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Weyland Corp Terminal Interface seriously. If you discover a security vulnerability, please follow these steps:

### 🔒 Private Disclosure

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities to:
- **Email**: security@example.com (replace with actual email)
- **Security Advisory**: Use GitHub's [Private Security Advisory](https://github.com/robimdev/didactic-lamp/security/advisories/new)

### 📋 Information to Include

When reporting a vulnerability, please include:

1. **Description**: A clear description of the vulnerability
2. **Impact**: The potential impact and attack scenarios
3. **Reproduction**: Step-by-step instructions to reproduce the issue
4. **Environment**: Browser, OS, and any relevant environment details
5. **Proof of Concept**: Code snippets, screenshots, or videos if applicable

### 🔄 Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution Timeline**: Varies based on complexity, typically 30-90 days

### 🛡️ Security Best Practices

When contributing to this project:

#### Frontend Security
- **XSS Prevention**: Always sanitize user inputs
- **Content Security Policy**: Follow CSP guidelines
- **Dependency Security**: Regularly update dependencies
- **Secret Management**: Never commit API keys or secrets

#### Development Security
- **Code Review**: All changes require review
- **Branch Protection**: Main branch is protected
- **Automated Scanning**: Dependencies are scanned for vulnerabilities
- **Environment Variables**: Use `.env` files for configuration

### 🏆 Recognition

We appreciate security researchers who help keep our project safe:

- **Hall of Fame**: Contributors will be credited (with permission)
- **Responsible Disclosure**: We follow responsible disclosure practices
- **Coordination**: We work with reporters to ensure proper fixes

### 📞 Contact

For non-security related issues, please use:
- **General Issues**: [GitHub Issues](https://github.com/robimdev/didactic-lamp/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/robimdev/didactic-lamp/discussions)

---

*This security policy is inspired by industry best practices and will be updated as needed.* 