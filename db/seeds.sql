INSERT INTO departments (dep_name)
VALUES  ("HR"),
        ("IT"),
        ("R&D"),
        ("Production");

INSERT INTO roles (title, salary, department_id)
VALUES  ("HR Generalist", 75000, 1),
        ("IT Manager", 70000, 2),
        ("Research Scientist", 90000, 3),
        ("Production Manager", 65000, 4),
        ("Lab Technician", 50000, 3),
        ("Production Associate", 45000, 4);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES  (1, "Paul", "Coffey", 4, NULL),
        (2, "Octavious", "Moore", 6, 1),
        (3, "Dane", "Thomason", 3, NULL),
        (4, "Tom", "Claffey", 5, 3),
        (5, "John", "Clark", 2, NULL),
        (6, "Dontae", "Simmons", 1, NULL);