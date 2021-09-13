require 'safe_yaml'

SafeYAML::OPTIONS[:deserialize_symbols] = true
SafeYAML::OPTIONS[:default_mode] = :safe

module AsciiDocsy
  releases = YAML.load_file('lib/asciidocsy/data/releases.yml')
  if releases['revisions'][0]['patches']
    VERSION = releases['revisions'][0]['patches'][0]['code']
  else
    VERSION = releases['revisions'][0]['code']
  end
end
