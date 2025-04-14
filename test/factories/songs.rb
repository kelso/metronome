FactoryBot.define do
  factory :song do
    playlist { nil }
    name { "MyString" }
    bpm { 1 }
    time_signature { "MyString" }
  end
end
