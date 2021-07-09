/**
 * Abstract base type used to make the {@link Multi} and {@link Normalized} types.
 */
type Base = {
  /**
   * Field to distinguish between different sites.
   */
  match?: string[];

  /**
   * The mode of this site.
   *
   * @example "amp"
   *
   * @defaultValue "default"
   */
  mode?: string;

  /**
   * Global state.
   */
  state?: Record<string, unknown>;
};

/**
 * The base type of a Frontity package.
 */
export type Package = {
  /**
   * Package name.
   */
  name: string;

  /**
   * Whether the package should be active or not.
   */
  active?: boolean;

  /**
   * Package state.
   */
  state?: Record<string, unknown>;
};

/**
 * Package that has been normalized.
 */
type NormalizedPackage = Required<Package>;

/**
 * Multi-site package.
 */
type Multi = Base & {
  /**
   * Site name.
   */
  name: string;
};

/**
 * Represents normalized single site settings.
 */
type Normalized<T> = Base & {
  /**
   * Mode of the site.
   */
  mode: string;

  /**
   * Site state.
   */
  state: Record<string, unknown>; // Default: {}

  /**
   * Packages of the site.
   */
  packages: T[];
};

/**
 * Normalized site settings.
 */
export type NormalizedSettings<T = NormalizedPackage> = Normalized<T> & Multi;

/**
 * A Frontity site.
 */
export type Site = {
  /**
   * Site name.
   */
  name: string;

  /**
   * The mode of this site.
   */
  mode: string;

  /**
   * Site packages.
   */
  packages: string[];
};
