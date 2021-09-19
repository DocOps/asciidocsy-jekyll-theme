# frozen_string_literal: true
require 'asciidocsy'

RSpec.describe AsciiDocsy do
  it "has a version number" do
    expect(AsciiDocsy::VERSION).not_to be nil
  end
end
