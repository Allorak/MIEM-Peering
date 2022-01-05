using System.Threading.Tasks;
using patools.Dtos.Experts;

namespace patools.Services.Experts
{
    public interface IExpertsService
    {
        Task<Response<GetExpertDtoResponse[]>> GetExperts(GetExpertDtoRequest info);
    }
}