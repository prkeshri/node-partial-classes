# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-01-15

### Added
- Initial release of the partial-classes package
- `supplement()` function to copy methods from partial classes to main classes
- `iterateDescriptors()` utility function for iterating over class descriptors
- Support for both static and instance methods
- Dynamic import support via string paths
- ES6 module compatibility
- Comprehensive documentation and examples

### Features
- Method injection from partial classes to main classes
- Automatic constructor exclusion
- Support for multiple partial class supplementation
- Lightweight implementation with no external dependencies

### Limitations
- Only methods (static and instance) are supported
- Properties, getters, setters, and other class members are not copied
- Constructor methods are automatically excluded
- Method override behavior when names conflict
