using System;

namespace patools.Dtos.Lti
{
    public class NewLtiTaskResponseDto
    {
        public string source_id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public bool return_user_data { get; set; }
        public string type { get; set; }
        public string url { get; set; }
        public int provider_id { get; set; }
        public string consumer_key { get; set; }
        public string shared_secret { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public int id { get; set; }
    }
}