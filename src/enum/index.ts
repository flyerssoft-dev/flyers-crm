/**
 * Enum Features
 *
 * This enum defines a set of feature identifiers used throughout the application.
 * Each identifier represents a specific module or functionality within the system.
 * These are used for feature-based access control and permissions management.
 */
enum Features {
  ONBOARDING = 'onboarding',
  BOARD = 'board',
  ASSET = 'asset',
  VENDOR = 'vendor',
}

/**
 * Enum Actions
 *
 * This enum defines a set of actions that can be performed within the system.
 * These actions are used to manage user permissions for various features.
 */
enum Actions {
  UPLOAD = 'Upload',
  CREATE = 'Create',
  READ = 'Read',
  UPDATE = 'Update',
  DELETE = 'Delete',
  ONBOARDING_IT = 'Onboarding_it',
}

export { Features, Actions };
