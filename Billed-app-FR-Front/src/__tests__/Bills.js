/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js"
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList).toContain('active-icon');
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills }) //Génére l'html de la page billsUI avc les données de bills
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    describe("When click on the eyes button", () => {
      test("Open the modal", async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        $.fn.modal = jest.fn(); // Corrige l'erreur Jquerry $(...).modal is not a function

        await waitFor(() => screen.getAllByTestId('icon-eye'))
        const firstIconEyeButton = screen.getAllByTestId("icon-eye")[0];
        userEvent.click(firstIconEyeButton);
        await waitFor(() => screen.getByAltText("Bill"));
        const billImage = screen.getByAltText("Bill");
        expect(billImage).toHaveAttribute(
            "src",
            "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
        );
      })
    })

    describe("When click the new bill button", () => {

      test("Then new bills form should open", async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)

        await waitFor(() => screen.getByTestId('btn-new-bill'))
        const btnNewBill = screen.getByTestId('btn-new-bill')
        userEvent.click(btnNewBill);
        router()
        window.onNavigate(ROUTES_PATH.NewBill)
        const url = window.location.href;
        expect(url).toEqual("http://localhost/"+ROUTES_PATH.NewBill);
      })
    })


  })
})