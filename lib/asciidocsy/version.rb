require 'safe_yaml'

SafeYAML::OPTIONS[:deserialize_symbols] = true
SafeYAML::OPTIONS[:default_mode] = :safe

module AsciiDocsy
  spec = Gem::Specification.find_by_name("asciidocsy")
  gem_root = spec.gem_dir
  releases = YAML.load_file(gem_root + '/lib/asciidocsy/data/releases.yml')
  if releases['revisions'][0]['patches']
    VERSION = releases['revisions'][0]['patches'][0]['code']
  else
    VERSION = releases['revisions'][0]['code']
  end
end
