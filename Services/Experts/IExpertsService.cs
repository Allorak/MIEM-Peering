using System.Collections.Generic;
using System.Threading.Tasks;
using patools.Dtos.Experts;

namespace patools.Services.Experts
{
    public interface IExpertsService
    {
        Task<Response<IEnumerable<GetExpertDtoResponse>>> GetExperts(GetExpertDtoRequest info);
    }
}