import {LoaderFunction} from "react-router-dom";
import {authRepository} from "@/repositories/auth-repository.ts";
import {catalogRepository} from "@/repositories/catalog-repository.ts";

export const catalogsLoader: LoaderFunction = async () => {
    const currentUser = await authRepository.getCurrentUser()

    if (!currentUser) return null;

    return catalogRepository.getCatalogsByUserId(currentUser.id)
}