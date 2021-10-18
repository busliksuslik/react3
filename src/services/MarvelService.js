import { useHttp } from "../hooks/http.hook";

const useMarvelService = () =>{
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'http://gateway.marvel.com/v1/public/'
    const _apiKey = "apikey=4a0f80d88c3ff1d7f7334601c277c07b";
    const _baseOffset = 210;

    const getAllCharacters = async(offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comic?orderBy=issueNumber&limit=8&offset=${_apiKey}`);
        return res.data.results.map(_transformComics);
    }
    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0,210)}...` : "There is no description for this character",
            thumbnail: char.thumbnail.path + '-' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || "there is no description",
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No informtion available',
            thumbnail: comics.thumbnail.path + '-' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices.price ? `${comics.prices.price}$` : "not available"
        }
    }
    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic}

}

export default useMarvelService;
